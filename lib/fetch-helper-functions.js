// NOTE(Alan): Taken from https://stackoverflow.com/a/65417849

import { isNil } from "lodash";

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON, status from the response
 */
const parseJSON = (response) =>
  new Promise((resolve) =>
    response.json().then((json) =>
      resolve({
        status: response.status,
        ok: response.ok,
        json,
      })
    )
  );

const paramIsDefined = (param) => !isNil(param) && param !== "null" && param !== "undefined";

export { parseJSON, paramIsDefined };
