#include <time.h>

#include <Arduino.h>
#include <RTC.h>
#include <WiFiUdp.h>

#include <NTPClient.h>

#include "clock.h"

namespace smartstrip::clock {

WiFiUDP udp;
NTPClient client(udp);

static void set_rtc() {
  RTCTime time = RTCTime(client.getEpochTime());
  RTC.setTime(time);
}

void setup() {
  /*
   * Since NTP updates are blocking, increase update interval from default of
   * 1min which is unnecessarily often. RTC seems to drift 1s every ~2min. Use
   * an interval of 4min as this seems to have a good balance between precision
   * and update frequency.
   */
  client.setUpdateInterval(240000);

  RTC.begin();
  client.begin();
  client.update();

  if (!client.isTimeSet()) {
    Serial.println("clock: failed to get time from NTP server");
    return;
  }

  set_rtc();
}

void loop() {
  if (client.update()) {
    set_rtc();
  }
}

static bool after_last_sunday_0100(const RTCTime& time, int month_days) {
  int seventh_last_day_of_month = month_days - 6;  // e.g. in March with 31 days, this is 25
  int day_of_month = time.getDayOfMonth();

  if (day_of_month < seventh_last_day_of_month) {
    return false;
  }

  // `time` is in last 7 days of month
  DayOfWeek day_of_week = time.getDayOfWeek();
  if (day_of_week == DayOfWeek::SUNDAY) {
    return time.getHour() >= 1;
  } else {
    int days_since_sunday = DayOfWeek2int(day_of_week, true) - 1;
    int prev_sunday_day_of_month = day_of_month - days_since_sunday;
    return prev_sunday_day_of_month >= seventh_last_day_of_month;
  }
}

static bool dst_eu(const RTCTime& time_utc) {
  int month = Month2int(time_utc.getMonth());

  if (month < 3) {
    // January-February: not DST
    return false;
  } else if (month == 3) {
    // March: DST after last Sunday at 01:00 UTC
    return after_last_sunday_0100(time_utc, 31);
  } else if (month < 10) {
    // April-September: DST
    return true;
  } else if (month == 10) {
    // October: DST until last Sunday at 01:00 UTC
    return !after_last_sunday_0100(time_utc, 31);
  } else {
    // November-December: not DST
    return false;
  }
}

static RTCTime utc_to_cet_or_cest(RTCTime& time_utc) {
  bool dst = dst_eu(time_utc);
  time_t offset = dst ? 7200 : 3600;
  RTCTime time(time_utc.getUnixTime() + offset);
  time.setSaveLight(dst ? SaveLight::SAVING_TIME_ACTIVE : SaveLight::SAVING_TIME_INACTIVE);
  return time;
}

RTCTime get_time_cet_or_cest() {
  RTCTime time_utc;
  RTC.getTime(time_utc);
  return utc_to_cet_or_cest(time_utc);
}

static void print_cet_or_cest(RTCTime& time_utc) {
  Serial.println(utc_to_cet_or_cest(time_utc).toString());
}

void test() {
  RTCTime time_utc;
  time_utc.setUnixTime(1704067200);  // 2024-01-01T00:00:00Z == 2024-01-01T01:00:00+01:00
  print_cet_or_cest(time_utc);
  time_utc.setUnixTime(1706745599);  // 2024-01-31T23:59:59Z == 2024-02-01T00:59:59+01:00
  print_cet_or_cest(time_utc);
  time_utc.setUnixTime(1706745600);  // 2024-02-01T00:00:00Z == 2024-02-01T01:00:00+01:00
  print_cet_or_cest(time_utc);
  time_utc.setUnixTime(1709251199);  // 2024-02-29T23:59:59Z == 2024-03-01T00:59:59+01:00
  print_cet_or_cest(time_utc);
  time_utc.setUnixTime(1709251200);  // 2024-03-01T00:00:00Z == 2024-03-01T01:00:00+01:00
  print_cet_or_cest(time_utc);
  time_utc.setUnixTime(1711324799);  // 2024-03-24T23:59:59Z == 2024-03-25T00:59:59+01:00
  print_cet_or_cest(time_utc);
  time_utc.setUnixTime(1711324800);  // 2024-03-25T00:00:00Z == 2024-03-25T01:00:00+01:00
  print_cet_or_cest(time_utc);
  time_utc.setUnixTime(1711843199);  // 2024-03-30T23:59:59Z == 2024-03-31T00:59:59+01:00
  print_cet_or_cest(time_utc);
  time_utc.setUnixTime(1711843200);  // 2024-03-31T00:00:00Z == 2024-03-31T01:00:00+01:00
  print_cet_or_cest(time_utc);
  time_utc.setUnixTime(1711846799);  // 2024-03-31T00:59:59Z == 2024-03-31T01:59:59+01:00
  print_cet_or_cest(time_utc);
  time_utc.setUnixTime(1711846800);  // 2024-03-31T01:00:00Z == 2024-03-31T03:00:00+02:00
  print_cet_or_cest(time_utc);
  time_utc.setUnixTime(1711929599);  // 2024-03-31T23:59:59Z == 2024-04-01T01:59:59+02:00
  print_cet_or_cest(time_utc);
  time_utc.setUnixTime(1711929600);  // 2024-04-01T00:00:00Z == 2024-04-01T02:00:00+02:00
  print_cet_or_cest(time_utc);
  time_utc.setUnixTime(1714521599);  // 2024-04-30T23:59:59Z == 2024-05-01T01:59:59+02:00
  print_cet_or_cest(time_utc);
  time_utc.setUnixTime(1714521600);  // 2024-05-01T00:00:00Z == 2024-05-01T02:00:00+02:00
  print_cet_or_cest(time_utc);
  time_utc.setUnixTime(1727740799);  // 2024-09-30T23:59:59Z == 2024-10-01T01:59:59+02:00
  print_cet_or_cest(time_utc);
  time_utc.setUnixTime(1727740800);  // 2024-10-01T00:00:00Z == 2024-10-01T02:00:00+02:00
  print_cet_or_cest(time_utc);
  time_utc.setUnixTime(1729814399);  // 2024-10-24T23:59:59Z == 2024-10-25T01:59:59+02:00
  print_cet_or_cest(time_utc);
  time_utc.setUnixTime(1729814400);  // 2024-10-25T00:00:00Z == 2024-10-25T02:00:00+02:00
  print_cet_or_cest(time_utc);
  time_utc.setUnixTime(1729987199);  // 2024-10-26T23:59:59Z == 2024-10-27T01:59:59+02:00
  print_cet_or_cest(time_utc);
  time_utc.setUnixTime(1729987200);  // 2024-10-27T00:00:00Z == 2024-10-27T02:00:00+02:00
  print_cet_or_cest(time_utc);
  time_utc.setUnixTime(1729990799);  // 2024-10-27T00:59:59Z == 2024-10-27T02:59:59+02:00
  print_cet_or_cest(time_utc);
  time_utc.setUnixTime(1729990800);  // 2024-10-27T01:00:00Z == 2024-10-27T02:00:00+01:00
  print_cet_or_cest(time_utc);
  time_utc.setUnixTime(1730073599);  // 2024-10-27T23:59:59Z == 2024-10-28T00:59:59+01:00
  print_cet_or_cest(time_utc);
  time_utc.setUnixTime(1730073600);  // 2024-10-28T00:00:00Z == 2024-10-28T01:00:00+01:00
  print_cet_or_cest(time_utc);
  time_utc.setUnixTime(1730419199);  // 2024-10-31T23:59:59Z == 2024-11-01T00:59:59+01:00
  print_cet_or_cest(time_utc);
  time_utc.setUnixTime(1730419200);  // 2024-11-01T00:00:00Z == 2024-11-01T01:00:00+01:00
  print_cet_or_cest(time_utc);
  time_utc.setUnixTime(1735689599);  // 2024-12-31T23:59:59Z == 2025-01-01T00:59:59+01:00
  print_cet_or_cest(time_utc);
}

}
