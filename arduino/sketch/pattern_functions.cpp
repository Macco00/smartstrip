#include <algorithm>
#include <iterator>
#include <limits.h>
#include <stdint.h>

#include <FastLED.h>

#include "func.h"
#include "model.h"

#include "pattern_functions.h"

#define DELAY_MOVING 100    //ms
#define DELAY_BLINKING 300  //ms
#define DELAY_PULSATING 40  //ms

#define PULSATING_MAX_STEP 32

namespace smartstrip::pattern_functions {

void toggle(CRGB leds[], CRGB color_background, CRGB color_on) {
  bool state = func::check(leds);
  if(state)
  {
    fill_solid(leds, NUM_LEDS, color_background);
    FastLED.show();
  }
  else
  {
    fill_solid(leds, NUM_LEDS, CRGB::Red);
    FastLED.show();
  }
}

unsigned long static_(CRGB (&leds)[NUM_LEDS], const CRGB (&colors)[NUM_LEDS]) {
  std::copy(std::begin(colors), std::end(colors), std::begin(leds));
  FastLED.show();
  return ULONG_MAX;
}

unsigned long blinking(CRGB (&leds)[NUM_LEDS], CRGB color_background, const CRGB (&colors_blink)[NUM_LEDS], bool *active) {
  if (*active) {
    fill_solid(leds, NUM_LEDS, color_background);
    FastLED.show();
    *active = false;
  } else {
    static_(leds, colors_blink);
    *active = true;
  }

  return DELAY_BLINKING;
}

unsigned long pulsating(CRGB (&leds)[NUM_LEDS], const CRGB (&colors)[NUM_LEDS], uint8_t max_brightness, pulsating_state_t *state) {
  if (!state->initialized) {
    static_(leds, colors);
    *state = { .initialized = true, .step = PULSATING_MAX_STEP, .step_increasing = false };
  } else {
    if (state->step == 0) {
      state->step_increasing = true;
    } else if (state->step >= PULSATING_MAX_STEP) {
      state->step_increasing = false;
    }

    if (state->step_increasing) {
      state->step++;
    } else {
      state->step--;
    }
  }

  FastLED.setBrightness(max_brightness * state->step / PULSATING_MAX_STEP);
  FastLED.show();

  return DELAY_PULSATING;
}

unsigned long moving(CRGB (&leds)[NUM_LEDS], const CRGB (&colors)[NUM_LEDS], uint8_t *offset) {
  *offset = (*offset + 1) % NUM_LEDS;

  for (int i = 0; i < NUM_LEDS; i++) {
    leds[(i + *offset) % NUM_LEDS] = colors[i];
  }

  FastLED.show();
  return DELAY_MOVING;
}

}
