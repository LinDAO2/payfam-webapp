import CollectionServices from "./collection-services";
import NotificationService from "./notification-service";
import PaystackServices from "./paystack-services";

export const collectionServices = new CollectionServices();

export const paystackServices = new PaystackServices();

export const notificationService = new NotificationService();
