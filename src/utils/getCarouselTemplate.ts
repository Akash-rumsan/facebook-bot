export function getCarouselTemplate() {
  return {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            buttons: [
              {
                type: "postback",
                title: "Explain MEF",
                payload: "explain_mef",
              },
            ],
          },
          {
            buttons: [
              {
                type: "postback",
                title: "MEF Membership plan",
                payload: "mef_membership",
              },
            ],
          },
          {
            buttons: [
              {
                type: "postback",
                title: "Membership fee",
                payload: "membership_fee",
              },
            ],
          },
        ],
      },
    },
  };
}
