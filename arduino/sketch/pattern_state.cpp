#include <limits.h>
#include <stdint.h>

#include <FastLED.h>

#include "model.h"
#include "pattern_functions.h"

#include "pattern_state.h"

#define INITIAL_BRIGHTNESS 30  // 0 - 255

namespace smartstrip::pattern_state {

CRGB leds[NUM_LEDS];

unsigned long next_step_millis = ULONG_MAX;
bool blinking_active;
pattern_functions::pulsating_state_t pulsating_state;
uint8_t moving_offset;

static void reset() {
  blinking_active = false;
  pulsating_state.initialized = false;
  moving_offset = NUM_LEDS - 1;  // first step will make this 0
}

void setup() {
  reset();
  FastLED.addLeds<WS2813, 3, GRB>(leds, NUM_LEDS);  //<LED diode type, data pin, RGB schema>
  FastLED.setBrightness(INITIAL_BRIGHTNESS);
  fill_solid(leds, NUM_LEDS, CRGB::Red);
  FastLED.show();
}

static void step(unsigned long now) {
  unsigned long delay;

  switch (model::led_mode) {
    case model::LedMode::Static:
      delay = pattern_functions::static_(leds, model::colors);
      break;
    case model::LedMode::Blinking:
      delay = pattern_functions::blinking(leds, CRGB::Black, model::colors, &blinking_active);
      break;
    case model::LedMode::Pulsating:
      delay = pattern_functions::pulsating(leds, model::colors, model::brightness, &pulsating_state);
      break;
    case model::LedMode::Moving:
      delay = pattern_functions::moving(leds, model::colors, &moving_offset);
      break;
    default:
      return;
  }

  next_step_millis = delay == ULONG_MAX ? ULONG_MAX : now + delay;
}

void loop() {
  unsigned long now = millis();

  if (now >= next_step_millis) {
    step(now);
  }
}

// called when user changes pattern
void update_pattern() {
  reset();
  FastLED.setBrightness(model::brightness);

  if (model::leds_active) {
    step(millis());
  } else {
    fill_solid(leds, NUM_LEDS, CRGB::Black);
    next_step_millis = ULONG_MAX;
  }

  FastLED.show();
}

}
