import { ordersRepository } from '@/lib/db/orders';

export async function GET(
  request: Request,
  { params }: { params: { customerId: string } }
) {
  try {
    const orders = await ordersRepository.findByCustomerId(params.customerId);

    return Response.json({
      customerId: params.customerId,
      orders: orders || [],
      total: orders?.length || 0
    });
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return Response.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
