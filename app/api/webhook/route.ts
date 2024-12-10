import { createLog } from '@/actions/log.actions';
import { createOrder } from '@/actions/orders.actions';
import { getStoreById } from '@/actions/store.actions';
import { db } from '@/lib/db';
import { Order } from '@/utils/types';
import { NextResponse } from "next/server";

export const POST = async (request: Request, response: Response) => {

      function extractEntrepotProducts(order: Order) {
            return order.line_items
                  .filter((item) => item.sku.startsWith("ENTP"))
                  .map((item) => {
                        const parts = item.sku.split("-");
                        const productId = parts[1];
                        const storeId = parts[2];
                        return {
                              id: productId,
                              name: item.name,
                              storeId: storeId,
                              standardPrice: parseFloat(item.price.toString()),
                              quantityRequested: parseInt(item.quantity.toString()),
                              quantityAvailable: 0,
                              supplierId: null,
                              userId: null,
                              basePrice: 0,
                        };
                  });
      };

      function checkIfStoreIdsAreIdentical(entrepotProducts: any[]) {
            return entrepotProducts.every((product) => product.storeId === entrepotProducts[0].storeId);
      }

      function checkValidStandradPrice(entrepotProducts: any[], products: any[]) {
            return entrepotProducts.every((product) => {
                  const productFound = products.find((p) => p.id === product.id);
                  return product.standardPrice > productFound.price;
            });
      }

      function addSupplierIdOrUserIdAndBasePrice(products: any[]) {
            return entrepotProducts.map((product) => {
                  const productFound = products.find((p) => p.id === product.id);
                  return {
                        ...product,
                        supplierId: productFound.supplierId ? productFound.supplierId : null,
                        userId: productFound.userId ? productFound.userId : null,
                        basePrice: productFound.price,
                        quantityAvailable: productFound.quantity,
                  };
            });
      }

      function checkIsProductsAvailable(entrepotProducts: any[], products: any[]) {
            return entrepotProducts.every((product) => {
                  const productFound = products.find((p) => p.id === product.id);
                  return productFound.stock >= product.quantityRequested;
            });
      }

      await createLog("Webhook received !");

      const payload = await request.json();

      if (!payload) {
            await createLog("No payload found !");
            return NextResponse.json({ message: "No payload found !" }, { status: 400 });
      }

      await createLog("Payload exist !");

      await createLog("Extracting entrepot products BEGIN...");
      let entrepotProducts = extractEntrepotProducts(payload);
      await createLog("Extracting entrepot products FINISHED !");


      if (entrepotProducts.length === 0) {
            await createLog("No entrepot products found in the order !");
            return NextResponse.json({ message: "No entrepot products found in the order !" }, { status: 400 });
      }

      await createLog("Checking if store ids are identical BEGIN...");
      const isStoreIdsIdentical = checkIfStoreIdsAreIdentical(entrepotProducts);
      await createLog("Checking if store ids are identical FINISHED !");

      if (!isStoreIdsIdentical) {
            await createLog("Store ids are not identical !");
            return NextResponse.json({ message: "Store ids are not identical !" }, { status: 400 });
      }

      await createLog("Getting store by id BEGIN...");
      const store = await getStoreById(entrepotProducts[0].storeId);
      await createLog("Getting store by id FINISHED !");

      if (!store || store.isDeleted) {
            await createLog("Store not found !");
            return NextResponse.json({ message: "Store not found !" }, { status: 404 });
      }

      await createLog("Getting products by id from databse BEGIN...");
      const products = await db.product.findMany({
            where: {
                  id: {
                        in: entrepotProducts.map((product) => product.id),
                  },
            },
      });
      await createLog("Getting products by id from databse FINISHED !");


      if (products.length !== entrepotProducts.length) {
            await createLog("Some products not found !");
            return NextResponse.json({ message: "Some products not found !" }, { status: 404 });
      }

      await createLog("Checking if standard price is valid BEGIN...");
      const isValidStandardPrice = checkValidStandradPrice(entrepotProducts, products);
      await createLog("Checking if standard price is valid FINISHED !");

      if (!isValidStandardPrice) {
            await createLog("Standard price is not valid !");
            return NextResponse.json({ message: "Standard price is not valid !" }, { status: 400 });
      }

      await createLog("Adding supplier id or user id and base price BEGIN...");
      entrepotProducts = addSupplierIdOrUserIdAndBasePrice(products);
      await createLog("Adding supplier id or user id and base price FINISHED !");

      await createLog("Checking if products are available BEGIN...");
      const isProductsAvailable = checkIsProductsAvailable(entrepotProducts, products);
      await createLog("Checking if products are available FINISHED !");

      if (!isProductsAvailable) {
            await createLog("Some products are not available !");
            return NextResponse.json({ message: "Some products are not available !" }, { status: 400 });
      }

      const shipping = payload.shipping;
      const billing = payload.billing;

      await createLog("Creating order BEGIN...");
      await createOrder({ entrepotProducts, storeId: store.id, shipping, billing });
      await createLog("Creating order FINISHED !");

      return NextResponse.json({ message: "Order created successfully !" }, { status: 201 });
}
