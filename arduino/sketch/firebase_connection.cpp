// based on https://github.com/mobizt/FirebaseClient/blob/v1.1.8/examples/RealtimeDatabase/Async/Stream/Stream.ino

#include <Arduino.h>
#include <WiFiSSLClient.h>

#include <FirebaseClient.h>

#include "config.h"
#include "firebase_model.h"
#include "model.h"

#include "firebase_connection.h"

namespace smartstrip::firebase_connection {

DefaultNetwork network;
UserAuth auth(FIREBASE_API_KEY, SERIAL_NUMBER "@device.smartstrip.invalid", FIREBASE_PASSWORD);
FirebaseApp app;

WiFiSSLClient main_ssl_client, stream_ssl_client;
AsyncClientClass main_firebase_client(main_ssl_client, getNetwork(network));
AsyncClientClass stream_firebase_client(stream_ssl_client, getNetwork(network));

RealtimeDatabase database;

static void callback(AsyncResult &result) {
  if (result.appEvent().code() > 0) {
    Firebase.printf("Event task: %s, msg: %s, code: %d\n", result.uid().c_str(), result.appEvent().message().c_str(), result.appEvent().code());
  }

  if (result.isDebug()) {
    Firebase.printf("Debug task: %s, msg: %s\n", result.uid().c_str(), result.debug().c_str());
  }

  if (result.isError()) {
    Firebase.printf("Error task: %s, msg: %s, code: %d\n", result.uid().c_str(), result.error().message().c_str(), result.error().code());
  }

  if (result.available()) {
    RealtimeDatabaseResult &db_result = result.to<RealtimeDatabaseResult>();
    Serial.println("----------------------------");

    if (db_result.isStream()) {
      Firebase.printf("task: %s\n", result.uid().c_str());
      Firebase.printf("event: %s\n", db_result.event().c_str());
      Firebase.printf("path: %s\n", db_result.dataPath().c_str());
      Firebase.printf("data: %s\n", db_result.to<const char *>());
      Firebase.printf("type: %d\n", db_result.type());

      firebase_model::handle_event(db_result);
    } else {
      Firebase.printf("task: %s, payload: %s\n", result.uid().c_str(), result.c_str());
    }
  }
}

void setup() {
  Serial.println("firebase_connection: setup...");
  Firebase.printf("Firebase Client v%s\n", FIREBASE_CLIENT_VERSION);
  Serial.println("Initializing app...");

  app.setCallback(callback);
  initializeApp(main_firebase_client, app, getAuth(auth));

  Serial.println("authenticating...");
  unsigned long ms = millis();
  while (app.isInitialized() && !app.ready() && millis() - ms < 120 * 1000)
    ;
  Serial.println("authenticated");

  app.getApp<RealtimeDatabase>(database);
  database.url(DATABASE_URL);

  database.get(stream_firebase_client, "/devices/" SERIAL_NUMBER, callback, true);

  Serial.println("firebase_connection: setup complete");
}

void loop() {
  // This function is required for handling async operations and maintaining the authentication tasks.
  app.loop();

  // This required when different AsyncClients than used in FirebaseApp assigned to the Realtime database functions.
  database.loop();
}

void send_leds_active() {
  database.set<bool>(main_firebase_client, "/devices/" SERIAL_NUMBER "/leds_active", model::leds_active, callback);
}

}
