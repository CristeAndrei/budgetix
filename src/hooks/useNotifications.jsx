import { useEffect, useState } from "react";
import { database } from "../firebase";

import { useDispatch, useSelector } from "react-redux";
import { updateNotifications } from "../redux/notificationSlice";

export function useNotifications() {
  const { uid } = useSelector(({ user }) => user.data);
  const dispatch = useDispatch();
  const { notificationList } = useSelector(
    ({ notifications }) => notifications
  );
  const [errorNotifications, setErrorNotifications] = useState("");
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  useEffect(() => {
    if (uid) {
      setLoadingNotifications(true);
      let unsubscribeNotifications = () => {};
      try {
        unsubscribeNotifications = database.tasks
          .where("options.userList", "array-contains", uid)
          .onSnapshot((snapshot) => {
            const docs = snapshot.docs.map(database.formatDoc);
            const formattedDocs = docs.map((doc) => {
              return { ...doc, performAt: doc.performAt.toMillis() };
            });
            dispatch(updateNotifications({ formattedDocs }));
          });
      } catch (err) {
        setErrorNotifications(
          "Something went wrong while getting the notifications"
        );
        console.log(err);
      }
      setLoadingNotifications(false);
      return unsubscribeNotifications;
    }
  }, [uid, dispatch]);

  return {
    notificationList,
    errorNotifications,
    loadingNotifications,
    setErrorNotifications,
  };
}
