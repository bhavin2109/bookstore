import React, { useEffect } from "react";
import { CheckCircle, Truck, Package, MapPin, Clock } from "lucide-react";
import { getSocket } from "../services/socketService";
import TrackingMap from "./TrackingMap";

const OrderTracker = ({ order }) => {
  const [liveLocation, setLiveLocation] = React.useState(null);

  useEffect(() => {
    const socket = getSocket();
    if (socket && order) {
      socket.emit("join_order", order._id);
      socket.on("location_update", (loc) => {
        setLiveLocation(loc);
      });
    }
    return () => {
      if (socket) socket.off("location_update");
    };
  }, [order]);

  const steps = [
    { status: "placed", label: "Order Placed", icon: Clock },
    { status: "packed_by_seller", label: "Packed", icon: Package },
    { status: "assigned_to_delivery", label: "Driver Assigned", icon: Truck },
    { status: "dispatched", label: "Dispatched", icon: Truck },
    { status: "out_for_delivery", label: "Out for Delivery", icon: MapPin },
    { status: "delivered", label: "Delivered", icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex(
    (s) => s.status === order.deliveryStatus
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Order Status</h3>

      {/* Timeline */}
      <div className="relative flex flex-col md:flex-row justify-between items-center w-full mb-8">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-0 transform -translate-y-1/2 hidden md:block"></div>

        {steps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const Icon = step.icon;

          return (
            <div
              key={step.status}
              className="relative z-10 flex flex-col items-center bg-white px-2"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted
                    ? "bg-green-500 border-green-500 text-white"
                    : isCurrent
                    ? "bg-blue-600 border-blue-600 text-white animate-pulse"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                <Icon size={18} />
              </div>
              <p
                className={`text-xs mt-2 font-medium ${
                  isCompleted || isCurrent ? "text-gray-800" : "text-gray-400"
                }`}
              >
                {step.label}
              </p>
              {/* Timestamp from order.timeline if available */}
              {order.timeline &&
                order.timeline.find((t) => t.status === step.status) && (
                  <span className="text-[10px] text-gray-500 mt-1">
                    {new Date(
                      order.timeline.find(
                        (t) => t.status === step.status
                      ).timestamp
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
            </div>
          );
        })}
      </div>

      {/* Tracking Map */}
      {(order.deliveryStatus === "out_for_delivery" ||
        order.deliveryStatus === "dispatched") && (
        <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-100 p-3 border-b border-gray-200 flex justify-between items-center">
            <span className="font-semibold text-gray-700 flex items-center gap-2">
              <MapPin size={16} /> Live Tracking
            </span>
            <span className="text-xs text-green-600 animate-pulse">
              ● Live Update
            </span>
          </div>
          <div className="h-64 relative">
            <TrackingMap orderId={order._id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracker;
