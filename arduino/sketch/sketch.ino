#include <Arduino.h>
#include <WiFiS3.h>

#include "audio_control.h"
#include "clock.h"
#include "config.h"
#include "firebase_connection.h"
#include "model.h"
#include "pattern_state.h"
#include "schedule.h"

#include "sketch.h"

using namespace smartstrip;

bool testMode = false; //true -> run tests. false -> run production

void setup() 
{
  Serial.begin(115200);
  pattern_state::setup();

  if(testMode)
  {
    audio_control::setup();
    clock::test();
  }
  else
  {
    Serial.print("Wi-Fi firmware: ");
    Serial.println(WiFi.firmwareVersion());
    Serial.print("latest Wi-Fi firmware: ");
    Serial.println(WIFI_FIRMWARE_LATEST_VERSION);

    Serial.print("connecting to Wi-Fi...");
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    while (WiFi.status() != WL_CONNECTED) {
      delay(1000);
      Serial.print(".");
    }

    Serial.println();
    Serial.print("connected with IP address: ");
    Serial.println(WiFi.localIP());
    Serial.println();

    clock::setup();

    model::add_observer(model::print_state);
    model::add_observer(pattern_state::update_pattern);
    firebase_connection::setup();

    audio_control::setup();
  }
}

void loop() 
{ 

  if (!testMode) {
    clock::loop();
    firebase_connection::loop();
    audio_control::loop();
    schedule::loop();
    pattern_state::loop();
  }
}
