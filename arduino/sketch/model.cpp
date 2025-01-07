#include <inttypes.h>
#include <stdint.h>
#include <stdio.h>
#include <vector>

#include <Arduino.h>

#include <FastLED.h>

#include "model.h"

namespace smartstrip::model {

uint8_t brightness = 0;
CRGB colors[NUM_LEDS] = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
LedMode led_mode = LedMode::Undefined;

bool leds_active = false;
bool audio_control_active = false;

bool schedule_active = false;
uint32_t schedule_start = 0;
uint32_t schedule_end = 0;

LedMode led_mode_from_str(const String &str) {
  if (str == "static") {
    return LedMode::Static;
  } else if (str == "blinking") {
    return LedMode::Blinking;
  } else if (str == "pulsating") {
    return LedMode::Pulsating;
  } else if (str == "moving") {
    return LedMode::Moving;
  } else {
    return LedMode::Undefined;
  }
}

const char *led_mode_to_str(LedMode led_mode) {
  switch (led_mode) {
    case LedMode::Static:
      return "static";
    case LedMode::Blinking:
      return "blinking";
    case LedMode::Pulsating:
      return "pulsating";
    case LedMode::Moving:
      return "moving";
    default:
      return "undefined";
  }
}

void print_state() {
  Serial.print("brightness: ");
  Serial.println(brightness);
  Serial.print("colors: [#");

  for (int i = 0; i < NUM_LEDS; i++) {
    char buf[9];
    sprintf(buf, "%06" PRIx32, static_cast<uint32_t>(colors[i]) & 0xffffff);
    Serial.print(buf);

    if (i != NUM_LEDS - 1) {
      Serial.print(", #");
    }
  }

  Serial.println("]");
  Serial.print("led_mode: ");
  Serial.println(led_mode_to_str(led_mode));
  Serial.print("leds_active: ");
  Serial.println(leds_active);
  Serial.print("audio_control_active: ");
  Serial.println(audio_control_active);

  Serial.print("schedule: ");
  if (schedule_active) {
    Serial.print(schedule_start);
    Serial.print(" to ");
    Serial.println(schedule_end);
  } else {
    Serial.println("inactive");
  }
}

std::vector<void (*)()> observers;

void add_observer(void (*observer)()) {
  observers.push_back(observer);
}

void notify_observers() {
  for (void (*observer)() : observers) {
    observer();
  }
}

}
