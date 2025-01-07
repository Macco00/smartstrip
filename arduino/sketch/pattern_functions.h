#ifndef SMARTSTRIP_PATTERN_FUNCTIONS_H
#define SMARTSTRIP_PATTERN_FUNCTIONS_H

#include <stdint.h>

#include <FastLED.h>

#include "model.h"

namespace smartstrip::pattern_functions {

typedef struct {
  bool initialized;
  uint8_t step;
  bool step_increasing;
} pulsating_state_t;

void toggle(CRGB leds[], CRGB color_background, CRGB color_on);

/*
 * These functions return the number of milliseconds to wait before the function
 * should be called again, or `ULONG_MAX` if it only needs to be called once.
 */
unsigned long static_(CRGB (&leds)[NUM_LEDS], const CRGB (&colors)[NUM_LEDS]);
unsigned long blinking(CRGB (&leds)[NUM_LEDS], CRGB color_background, const CRGB (&colors_blink)[NUM_LEDS], bool *active);
unsigned long pulsating(CRGB (&leds)[NUM_LEDS], const CRGB (&colors)[NUM_LEDS], uint8_t max_brightness, pulsating_state_t *state);
unsigned long moving(CRGB (&leds)[NUM_LEDS], const CRGB (&colors)[NUM_LEDS], uint8_t *offset);

}

#endif
