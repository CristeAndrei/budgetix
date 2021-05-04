import { useEffect } from "react";
import { database } from "../firebase";

import { useDispatch, useSelector } from "react-redux";
import { updateNotifications } from "../redux/notificationSlice";

export function useNotifications() {
  const { userName } = useSelector(({ user }) => user.data);
  const dispatch = useDispatch();
  const { notificationList } = useSelector(
    ({ notifications }) => notifications
  );

  useEffect(() => {
    if (userName) {
      return database.tasks
        .where("options.userList", "array-contains", userName)
        .where("type", "==", "invoiceNotification")
        .onSnapshot((snapshot) => {
          const docs = snapshot.docs.map(database.formatDoc);
          const formattedDocs = docs.map((item) => {
            return { ...item, performAt: item.performAt.toMillis() };
          });
          dispatch(updateNotifications({ formattedDocs }));
        });
    }
  }, [userName, dispatch]);

  return { notificationList };
}
