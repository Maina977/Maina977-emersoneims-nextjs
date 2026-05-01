import numpy as np
from scipy.sparse import lil_matrix
from scipy.sparse.linalg import spsolve

class ERTForward2D:
    def __init__(self, nx=50, nz=20, dx=1.0, dz=1.0):
        self.nx = nx
        self.nz = nz
        self.dx = dx
        self.dz = dz
        self.n_cells = nx * nz
        
    def build_mesh(self):
        """Build 2D finite element mesh"""
        x = np.arange(0, self.nx * self.dx, self.dx)
        z = np.arange(0, self.nz * self.dz, self.dz)
        return x, z
    
    def assemble_system(self, resistivity_model, electrode_positions):
        """Assemble finite element system using 4-node quadrilateral elements.
        
        Each cell is a bilinear quad element with conductivity σ = 1/ρ.
        Local stiffness matrix Ke = σ_e * ∫∫ (∇N)^T (∇N) dx dz
        For a rectangular element (dx × dz), the analytical local stiffness is:
        
        Ke = (σ/(6·dx·dz)) * [
            [2(dx²+dz²), (dz²-2dx²), -(dx²+dz²), (dx²-2dz²)],
            [(dz²-2dx²), 2(dx²+dz²), (dx²-2dz²), -(dx²+dz²)],
            [-(dx²+dz²), (dx²-2dz²), 2(dx²+dz²), (dz²-2dx²)],
            [(dx²-2dz²), -(dx²+dz²), (dz²-2dx²), 2(dx²+dz²)]
        ]
        """
        n_nodes = (self.nx + 1) * (self.nz + 1)
        A = lil_matrix((n_nodes, n_nodes))
        b = np.zeros(n_nodes)
        
        # Convert resistivity to conductivity
        conductivity = 1.0 / resistivity_model
        
        dx2 = self.dx ** 2
        dz2 = self.dz ** 2
        area = self.dx * self.dz
        
        # Precompute local stiffness template (normalized by conductivity)
        # For rectangular bilinear element: Ke_ij = σ/(6·area) * K_template
        k11 = 2 * (dx2 + dz2)
        k12 = dz2 - 2 * dx2
        k13 = -(dx2 + dz2)
        k14 = dx2 - 2 * dz2
        ke_template = np.array([
            [k11, k12, k13, k14],
            [k12, k11, k14, k13],
            [k13, k14, k11, k12],
            [k14, k13, k12, k11],
        ]) / (6.0 * area)
        
        # Assemble global stiffness matrix
        for iz in range(self.nz):
            for ix in range(self.nx):
                cell_idx = iz * self.nx + ix
                sigma = conductivity[cell_idx]
                
                # Node indices for this quad element (counter-clockwise)
                # Bottom-left, bottom-right, top-right, top-left
                n0 = iz * (self.nx + 1) + ix           # bottom-left
                n1 = iz * (self.nx + 1) + ix + 1       # bottom-right
                n2 = (iz + 1) * (self.nx + 1) + ix + 1 # top-right
                n3 = (iz + 1) * (self.nx + 1) + ix     # top-left
                
                nodes = [n0, n1, n2, n3]
                ke_local = sigma * ke_template
                
                for ii in range(4):
                    for jj in range(4):
                        A[nodes[ii], nodes[jj]] += ke_local[ii, jj]
        
        return A.tocsr(), b
    
    def solve_potential(self, A, b, source_position):
        """Solve for electrical potential"""
        # Apply current source
        b[source_position] = 1.0
        
        # Solve linear system
        potential = spsolve(A, b)
        
        return potential
    
    def calculate_apparent_resistivity(self, potential, electrode_positions):
        """Calculate apparent resistivity values"""
        # Get potentials at electrode positions
        Va = potential[electrode_positions['A']]
        Vb = potential[electrode_positions['B']]
        Vm = potential[electrode_positions['M']]
        Vn = potential[electrode_positions['N']]
        
        # Calculate geometric factor
        K = self.geometric_factor(electrode_positions)
        
        # Calculate apparent resistivity
        rho_a = K * (Vm - Vn) / (Va - Vb)
        
        return rho_a
    
    def geometric_factor(self, electrodes):
        """Calculate geometric factor for Wenner array"""
        AM = np.linalg.norm(electrodes['A'] - electrodes['M'])
        AN = np.linalg.norm(electrodes['A'] - electrodes['N'])
        BM = np.linalg.norm(electrodes['B'] - electrodes['M'])
        BN = np.linalg.norm(electrodes['B'] - electrodes['N'])
        
        K = 2 * np.pi / (1/AM - 1/BM - 1/AN + 1/BN)
        return K
    
    def forward_model(self, resistivity_model, electrode_configs):
        """Run forward modeling for multiple electrode configurations"""
        A, b = self.assemble_system(resistivity_model, None)
        results = []
        
        for config in electrode_configs:
            potential = self.solve_potential(A, b, config['source'])
            rho_a = self.calculate_apparent_resistivity(potential, config)
            results.append(rho_a)
        
        return np.array(results)
    
    def generate_synthetic_data(self, model, noise_level=0.05):
        """Generate synthetic ERT data with noise"""
        clean_data = self.forward_model(model, self.get_electrode_configs())
        
        # Add Gaussian noise
        noise = np.random.normal(0, noise_level, len(clean_data))
        noisy_data = clean_data * (1 + noise)
        
        return noisy_data
    
    def get_electrode_configs(self):
        """Generate Wenner array configurations"""
        configs = []
        n_electrodes = min(20, self.nx)
        
        for spacing in range(1, n_electrodes // 3):
            for start in range(n_electrodes - 3 * spacing):
                configs.append({
                    'A': start,
                    'B': start + spacing,
                    'M': start + 2 * spacing,
                    'N': start + 3 * spacing,
                    'source': start
                })
        
        return configs