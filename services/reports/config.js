/**
 * Creating normal reporter
 * @param {*} text
 * @param {*} type
 */

export const create = (text, type = 'mrkdwn') => {
  return {
    type: 'section',
    text: {
      type: type,
      text: text,
    },
  }
}
