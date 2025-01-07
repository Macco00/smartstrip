#include <time.h>

#include "clock.h"
#include "firebase_connection.h"
#include "model.h"

#include "schedule.h"

namespace smartstrip::schedule {

static int occurences_since_epoch(time_t t, time_t day_seconds) {
  return (t - day_seconds) / 86400;
}

// check if any second after `a` but not after `b` is `day_seconds` seconds after midnight
static bool occurs_between(time_t a, time_t day_seconds, time_t b) {
  return occurences_since_epoch(a, day_seconds) < occurences_since_epoch(b, day_seconds);
}

void loop() {
  static time_t last_check = clock::get_time_cet_or_cest().getUnixTime();
  time_t now = clock::get_time_cet_or_cest().getUnixTime();

  if (model::schedule_active) {
    bool update_leds_active = false;
    bool new_leds_active;

    if (occurs_between(last_check, model::schedule_start, now)) {
      update_leds_active = true;
      new_leds_active = true;
    } else if (occurs_between(last_check, model::schedule_end, now)) {
      update_leds_active = true;
      new_leds_active = false;
    }

    if (update_leds_active) {
      model::leds_active = new_leds_active;
      model::notify_observers();
      firebase_connection::send_leds_active();
    }
  }

  last_check = now;
}

}
