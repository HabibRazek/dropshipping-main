import { getPendingOrdersOlderThan72Hours, rejectOrder } from "@/actions/orders.actions";
import { stat } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (request: NextRequest, response: NextResponse) => {
    try {
        const orders = await getPendingOrdersOlderThan72Hours();
        
        if (orders.length === 0) {
            return NextResponse.json({ message: "No orders to reject" }, { status: 200 });
        }

        for (const order of orders) {
            await rejectOrder(order.id, "/dashboard");
        }

        return NextResponse.json({ message: "Cron Job Reject Updat Done"}, { status: 200 });
    } catch (error) {
        console.error('Error rejecting orders:', error);
        return NextResponse.json({ message: "Error rejecting orders" }, { status: 500 });
    }
}
