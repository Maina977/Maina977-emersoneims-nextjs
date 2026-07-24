import { ordersRepository } from '@/lib/db/orders';

export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const order = await ordersRepository.findById(params.orderId);

    if (!order) {
      return Response.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return Response.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return Response.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
