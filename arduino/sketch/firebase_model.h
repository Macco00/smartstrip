#ifndef SMARTSTRIP_FIREBASE_MODEL_H
#define SMARTSTRIP_FIREBASE_MODEL_H

#include <FirebaseClient.h>

namespace smartstrip::firebase_model {

void handle_event(RealtimeDatabaseResult &event);

}

#endif
