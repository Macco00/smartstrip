#include <stdint.h>
#include <stdlib.h>

#include <Arduino.h>

#include <ArduinoJson.h>
#include <FirebaseClient.h>

#include "model.h"

#include "firebase_model.h"

namespace smartstrip::firebase_model {

static void update_colors(const JsonArrayConst json_colors) {
  int i = 0;

  for (uint32_t color : json_colors) {
    if (i >= NUM_LEDS) {
      Serial.println("firebase_model: too many colors");
      return;
    }

    model::colors[i] = color;
    i++;
  }

  if (i < NUM_LEDS) {
    Serial.print("firebase_model: too few colors: ");
    Serial.println(i);
  }
}

static void update_color(int i, const JsonVariantConst color) {
  if (i < 0 || i >= NUM_LEDS) {
    Serial.print("firebase_model: invalid index for colors array: ");
    Serial.println(i);
    return;
  }

  model::colors[i] = color.as<uint32_t>();
}

static void update_led_mode(const String &led_mode_str) {
  model::led_mode = model::led_mode_from_str(led_mode_str);
}

static void update_current_pattern(const JsonObjectConst current_pattern, bool put) {
  const JsonVariantConst maybe_brightness = current_pattern["brightness"];
  if (!maybe_brightness.isNull()) {
    model::brightness = maybe_brightness;
  } else if (put) {
    Serial.println("firebase_model: put to current_pattern is missing key: brightness");
  }

  const JsonVariantConst maybe_colors = current_pattern["colors"];
  if (!maybe_colors.isNull()) {
    update_colors(maybe_colors);
  } else if (put) {
    Serial.println("firebase_model: put to current_pattern is missing key: colors");
  }

  const JsonVariantConst maybe_led_mode = current_pattern["led_mode"];
  if (!maybe_led_mode.isNull()) {
    update_led_mode(maybe_led_mode);
  } else if (put) {
    Serial.println("firebase_model: put to current_pattern is missing key: led_mode");
  }
}

static void update_schedule(const JsonVariantConst schedule, bool put) {
  if (schedule.isNull()) {
    model::schedule_active = false;
    return;
  }

  JsonObjectConst schedule_object = schedule;
  model::schedule_active = true;

  const JsonVariantConst maybe_start = schedule["start"];
  if (!maybe_start.isNull()) {
    model::schedule_start = maybe_start;
  } else if (put) {
    Serial.println("firebase_model: put to schedule is missing key: start");
  }

  const JsonVariantConst maybe_end = schedule["end"];
  if (!maybe_end.isNull()) {
    model::schedule_end = maybe_end;
  } else if (put) {
    Serial.println("firebase_model: put to schedule is missing key: end");
  }
}

static void update_root(const JsonObjectConst root, bool put) {
  const JsonVariantConst maybe_current_pattern = root["current_pattern"];
  if (!maybe_current_pattern.isNull()) {
    update_current_pattern(maybe_current_pattern, true);
  } else if (put) {
    Serial.println("firebase_model: put to root is missing key: current_pattern");
  }

  const JsonVariantConst maybe_leds_active = root["leds_active"];
  if (!maybe_leds_active.isNull()) {
    model::leds_active = maybe_leds_active;
  } else if (put) {
    Serial.println("firebase_model: put to root is missing key: leds_active");
  }

  const JsonVariantConst maybe_audio_control_active = root["audio_control_active"];
  if (!maybe_audio_control_active.isNull()) {
    model::audio_control_active = maybe_audio_control_active;
  } else if (put) {
    Serial.println("firebase_model: put to root is missing key: audio_control_active");
  }

  // schedule is optional
  if (put || root.containsKey("schedule")) {
    update_schedule(root["schedule"], true);
  }
}

void handle_event(RealtimeDatabaseResult &event) {
  String event_type = event.event();

  if (event_type == "keep-alive") {
    // do nothing
  } else if (event_type == "put" || event_type == "patch") {
    String path = event.dataPath();

    JsonDocument doc;
    DeserializationError error = deserializeJson(doc, event.data());

    if (error) {
      Serial.print("firebase_model: deserializeJson() failed: ");
      Serial.println(error.c_str());
      return;
    }

    if (event_type == "put") {
      if (path == "/") {
        update_root(doc.as<JsonObjectConst>(), true);
      } else if (path == "/current_pattern") {
        update_current_pattern(doc.as<JsonObjectConst>(), true);
      } else if (path == "/current_pattern/brightness") {
        model::brightness = doc.as<uint8_t>();
      } else if (path == "/current_pattern/colors") {
        update_colors(doc.as<JsonArrayConst>());
      } else if (path == "/current_pattern/led_mode") {
        update_led_mode(doc.as<String>());
      } else if (path.startsWith("/current_pattern/colors/")) {
        int i = path.substring(24).toInt();
        update_color(i, doc.as<JsonVariantConst>());
      } else if (path == "/leds_active") {
        model::leds_active = doc.as<bool>();
      } else if (path == "/audio_control_active") {
        model::audio_control_active = doc.as<bool>();
      } else if (path == "/schedule") {
        update_schedule(doc, true);
      } else if (path == "/schedule/start") {
        model::schedule_start = doc.as<uint32_t>();
      } else if (path == "/schedule/end") {
        model::schedule_end = doc.as<uint32_t>();
      } else {
        Serial.print("firebase_model: put to unknown path: ");
        Serial.println(path);
        return;
      }
    } else if (event_type == "patch") {
      if (path == "/") {
        update_root(doc.as<JsonObjectConst>(), false);
      } else if (path == "/current_pattern") {
        update_current_pattern(doc.as<JsonObjectConst>(), false);
      } else if (path == "/current_pattern/colors") {
        JsonObjectConst colors_patch = doc.as<JsonObjectConst>();
        for (JsonPairConst color_kv : colors_patch) {
          int i = atoi(color_kv.key().c_str());
          update_color(i, color_kv.value());
        }
      } else if (path == "/schedule") {
        update_schedule(doc, false);
      } else {
        Serial.print("firebase_model: patch to unknown path: ");
        Serial.println(path);
        return;
      }
    }

    model::notify_observers();
  } else {
    Serial.print("firebase_model: unknown event type: ");
    Serial.println(event_type);
  }
}

}
