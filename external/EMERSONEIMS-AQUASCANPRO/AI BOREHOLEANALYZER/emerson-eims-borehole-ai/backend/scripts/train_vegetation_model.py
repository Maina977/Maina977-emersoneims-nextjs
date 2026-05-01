#!/usr/bin/env python3
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset

class VisionTransformer(nn.Module):
    def __init__(self, num_classes=10):
        super().__init__()
        self.patch_size = 16
        self.embed_dim = 768
        self.num_heads = 12
        self.num_layers = 12
        
        self.conv_proj = nn.Conv2d(3, self.embed_dim, kernel_size=self.patch_size, stride=self.patch_size)
        self.pos_embed = nn.Parameter(torch.randn(1, 196, self.embed_dim))
        self.blocks = nn.ModuleList([
            nn.TransformerEncoderLayer(d_model=self.embed_dim, nhead=self.num_heads)
            for _ in range(self.num_layers)
        ])
        self.norm = nn.LayerNorm(self.embed_dim)
        self.head = nn.Linear(self.embed_dim, num_classes)
    
    def forward(self, x):
        x = self.conv_proj(x)
        x = x.flatten(2).transpose(1, 2)
        x = x + self.pos_embed
        for block in self.blocks:
            x = block(x)
        x = self.norm(x)
        x = x.mean(dim=1)
        return self.head(x)

def train_model():
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model = VisionTransformer(num_classes=15).to(device)
    
    # Synthetic data
    X_train = torch.randn(5000, 3, 224, 224)
    y_train = torch.randint(0, 15, (5000,))
    train_loader = DataLoader(TensorDataset(X_train, y_train), batch_size=32, shuffle=True)
    
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    
    for epoch in range(50):
        model.train()
        total_loss = 0
        for batch_X, batch_y in train_loader:
            batch_X, batch_y = batch_X.to(device), batch_y.to(device)
            optimizer.zero_grad()
            outputs = model(batch_X)
            loss = criterion(outputs, batch_y)
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
        
        print(f"Epoch {epoch+1}, Loss: {total_loss/len(train_loader):.4f}")
    
    torch.save(model.state_dict(), '../ai_models/vegetation/weights/vit_model.pth')
    print("Model saved successfully!")

if __name__ == "__main__":
    train_model()