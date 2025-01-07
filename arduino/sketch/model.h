#ifndef SMARTSTRIP_MODEL_H
#define SMARTSTRIP_MODEL_H

#include <stdint.h>

#include <Arduino.h>

#include <FastLED.h>

#define NUM_LEDS 30

namespace smartstrip::model {

enum class LedMode {
  Undefined,
  Static,
  Blinking,
  Pulsating,
  Moving,
};

extern uint8_t brightness;
extern CRGB colors[NUM_LEDS];
extern LedMode led_mode;

extern bool leds_active;
extern bool audio_control_active;

extern bool schedule_active;
extern uint32_t schedule_start;
extern uint32_t schedule_end;

LedMode led_mode_from_str(const String &str);
const char *led_mode_to_str(LedMode led_mode);
void print_state();

void add_observer(void (*observer)());
void notify_observers();

}

#endif
