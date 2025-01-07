# Database schema

Root contains three keys: `users`, `devices` and `predefined_patterns`

## `users`

An object where the keys are user IDs as provided by Firebase Authentication. The values are objects of the following format:

```json
{
  "devices": {
    "A1B2C3": {
      "id": "A1B2C3",
      "label": "Kitchen"
    }
  },
  "display_name": "Bob",
  "saved_patterns": [],
  "statistics": {
    "bestGameEasy": 0,
    "bestGameMedium": 0,
    "bestGameHard": 0,
    "avgScoreEasy": 0,
    "avgScoreMedium": 0,
    "avgScoreHard": 0,
    "attemptsEasy": 0,
    "attemptsMedium": 0,
    "attemptsHard": 0
  }
}
```

The keys in `"devices"` are serial numbers as defined below. The serial number can also optionally be stored in an `"id"` property (as above) for compatibility with an old format. If this property exists, it has priority over the key in `"devices"`. If the values do not match (for example, if a device is stored in the old format), the client must change the key in `"devices"` to match the `"id"` property, or it may be blocked from accessing other device data.

`"saved_patterns"` contains an array of pattern objects.

## `devices`

An object where the keys are serial numbers (6 uppercase alhphanumeric characters). The values are objects of the following format:

```json
{
  "current_pattern": {},
  "leds_active": true,
  "audio_control_active": true,
  "schedule": {
    "start": 36000,
    "end": 72000
  }
}
```

`"current_pattern"` contains a pattern object. `"schedule"` is `null` if the user has not set a schedule. The `"start"` and `"end"` values are in seconds after midnight (in the example, 10:00 to 20:00).

## `predefined_patterns`

```json
{
  "colors": [],
  "gradients": []
}
```

Each entry is an array of pattern objects.

## Pattern object

A lighting/color pattern is an object of the following form:

```jsonc
{
  "colors": [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, 29
  ],
  "led_mode": "static",
  "brightness": 255,

  // not present within `devices`
  "label": "Rainbow"
}
```

### `colors`

An array of 30 colors. Each color is a 24-bit unsigned integer (`0` to `16777215`, both inclusive) where the bytes from most significant to least significant are the red, green and blue color channels, respectively.

#### Examples

- `0` (`0x000000`): black
- `16711680` (`0xff0000`): red
- `65280` (`0x00ff00`): green
- `255` (`0x0000ff`): blue
- `16777215` (`0xffffff`): white

### `led_mode`

One of the following strings:

- `"static"`: display the specified colors without changing
- `"blinking"`: repeatedly toggle between the specified colors and off
- `"pulsating"`: like `"blinking"` but with a gradual change
- `"moving"`: colors shift along the LED strip at an interval

### `brightness`

Controls global brightness of LED strip. An integer between `5` (lowest where red, green and blue are all visible) and `255` (highest).

### `label`

Description of pattern.
