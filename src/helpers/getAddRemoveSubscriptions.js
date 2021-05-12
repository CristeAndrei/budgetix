export default function getAddRemoveSubscriptions(
  subscribedElements,
  chosenOptions
) {
  const addedSubscriptions = subscribedElements.filter(
    (subscribedElement) =>
      !chosenOptions.some(
        (userChosen) =>
          JSON.stringify(subscribedElement) === JSON.stringify(userChosen)
      )
  );

  const removedSubscriptions = chosenOptions.filter(
    (userChosen) =>
      !subscribedElements.some(
        (subscribedElement) =>
          JSON.stringify(subscribedElement) === JSON.stringify(userChosen)
      )
  );
  return { addedSubscriptions, removedSubscriptions };
}
