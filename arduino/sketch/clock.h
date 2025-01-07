#ifndef SMARTSTRIP_CLOCK_H
#define SMARTSTRIP_CLOCK_H

#include <RTC.h>

namespace smartstrip::clock {

void setup();
void loop();

RTCTime get_time_cet_or_cest();

void test();

}

#endif
