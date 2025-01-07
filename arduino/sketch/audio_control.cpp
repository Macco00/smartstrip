#include <Arduino.h>

#include "firebase_connection.h"
#include "model.h"
#include "sketch.h"

#include "audio_control.h"

namespace smartstrip::audio_control {

const int interruptPin = 2;  // Interrupt pin

volatile unsigned long lastInterruptTime = 0;  // Time of last interrupt
volatile bool toggle_leds_next_loop = false;   // flag set on interrupt

// used for test LED
const int outputPin = 6;            // Output pin
volatile bool outputState = false;  // Initial output state

/*
 * This interrupt service routine (ISR) is called to handle an interrupt on
 * `interruptPin`. What it can safely do is more limited than for other
 * functions. For details, see
 * https://www.arduino.cc/reference/en/language/functions/external-interrupts/attachinterrupt/#_about_interrupt_service_routines
 */
static void isr() {
  unsigned long currentMillis = millis();

  // Check if 1 second has passed since the last interrupt
  if (currentMillis - lastInterruptTime >= 1000) {
    if (testMode) {
      // Toggle the output state
      outputState = !outputState;

      // Write the new state to the output pin
      digitalWrite(outputPin, outputState);
    } else {
      toggle_leds_next_loop = true;
    }

    // Update the time of the last interrupt
    lastInterruptTime = currentMillis;
  }
}

// Setup of audio sensor
void setup() {
  pinMode(interruptPin, INPUT);  // Set the interrupt pin as input with internal pull-up resistor

  if (testMode) {
    pinMode(outputPin, OUTPUT);  // Set the output pin as output
  }

  // Attach interrupt to the interrupt pin
  attachInterrupt(digitalPinToInterrupt(interruptPin), isr, CHANGE);
}

void loop() {
  if (toggle_leds_next_loop) {
    if (model::audio_control_active) {
      model::leds_active = !model::leds_active;
      model::notify_observers();
      firebase_connection::send_leds_active();
    }

    toggle_leds_next_loop = false;
  }
}

}
