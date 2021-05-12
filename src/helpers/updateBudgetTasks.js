import { database, firestore } from "../firebase";

export default async function updateBudgetTasks(
  subscribedBudgetsRef,
  value = null,
  newLimit = null
) {
  try {
    const batch = firestore.batch();

    const budgetDoc = await subscribedBudgetsRef.get();

    const budgetData = budgetDoc.data();

    const newTotalBalance = budgetData.totalBalance + value;

    const limit = newLimit === null ? budgetData.limit : newLimit;

    //if you get over the limit of the budget create a notification or update a existing one
    if (
      (limit > 0 && limit <= newTotalBalance) ||
      (limit < 0 && limit >= newTotalBalance)
    ) {
      const overTheLimitValue =
        limit > 0 ? newTotalBalance - limit : limit - newTotalBalance;

      const taskRef = database.tasks.doc(budgetDoc.id);

      const taskDoc = await taskRef.get();

      if (taskDoc.exists) {
        batch.update(taskRef, {
          performAt: new Date(),
          type: "budgetNotification",
          status: "scheduled",
          worker:
            budgetData.userList.length > 1
              ? "sendMultipleDeviceMessage"
              : "sendDeviceMessage",
          options: {
            userList: budgetData.userList,
            daysTimeout: 1,
            payload: {
              notification: {
                title: "Budget notification",
                body:
                  overTheLimitValue === 0
                    ? `The limit set on budget ${budgetData.name} has been passed`
                    : `The limit set on budget ${budgetData.name} is passed by ${overTheLimitValue}`,
              },
            },
          },
        });
      } else {
        batch.set(taskRef, {
          performAt: new Date(),
          type: "budgetNotification",
          status: "scheduled",
          worker:
            budgetData.userList.length > 1
              ? "sendMultipleDeviceMessage"
              : "sendDeviceMessage",
          options: {
            userList: budgetData.userList,
            daysTimeout: 1,
            payload: {
              notification: {
                title: "Budget notification",
                body: `The limit set on budget ${budgetData.name} is passed by ${overTheLimitValue}`,
              },
            },
          },
        });
      }
    }

    //if you get bellow the limit of the budget but a notification exists then remove it or if the decimal value isn't passed
    if (
      (limit > 0 && limit > newTotalBalance) ||
      (limit < 0 && limit < newTotalBalance) ||
      (value === null && newLimit === null)
    ) {
      const taskRef = database.tasks.doc(budgetDoc.id);

      const taskDoc = await taskRef.get();

      if (taskDoc.exists) {
        batch.delete(taskRef);
      }
    }

    await batch.commit();
  } finally {
  }
}
