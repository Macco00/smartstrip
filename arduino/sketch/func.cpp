#include <FastLED.h>

#include "model.h"

#include "func.h"

bool func::check(CRGB leds[])
{
  // Show RGB of all leds in seriel monitor
  String cColor = "";
  bool isOn = false;
  for(int i=0; i < NUM_LEDS; i++){
    cColor = (String)i + ": " + (String)leds[i].r + " " + (String)leds[i].g + " " + (String)leds[i].b;
    //Serial.println(cColor);

    // Checks if any leds are on
    if(isOn == false && leds[i].r + leds[i].g + leds[i].b != 0)
      isOn = true;
  }
  return isOn;
}
