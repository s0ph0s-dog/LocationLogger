// I Can't Believe It's Not In The Standard Library!

/* Format a Date as an RFC 3339 timestamp <b>with the original time zone</b>
 * (rather than converting it to UTC, as Date.prototype.toISOString() does).
 * @param d Date The date to format
 * @return string The date, formatted as above.
 */
export function rfc3339(d: Date): string {

  function pad(n: number) {
    return n < 10 ? "0" + n : n;
  }

  function timezoneOffset(offset: number) {
    var sign;
    if (offset === 0) {
      return "Z";
    }
    sign = (offset > 0) ? "-" : "+";
    offset = Math.abs(offset);
    return sign + pad(Math.floor(offset / 60)) + ":" + pad(offset % 60);
  }

  return d.getFullYear() + "-" +
    pad(d.getMonth() + 1) + "-" +
    pad(d.getDate()) + "T" +
    pad(d.getHours()) + ":" +
    pad(d.getMinutes()) + ":" +
    pad(d.getSeconds()) +
    timezoneOffset(d.getTimezoneOffset());
}
