#include <FastLED.h>

const int rgbRed = 12;
const int rgbGreen = 13;
const int rgbBlue = 15;

float colorStep;
int delayTime;

#define LED_PIN     14
#define NUM_LEDS    45
#define BRIGHTNESS  255
#define LED_TYPE    WS2811
#define COLOR_ORDER BRG
CRGB leds[NUM_LEDS];

#define UPDATES_PER_SECOND 100

void setup() {

  Serial.begin(9600);
  Serial.print("Starting up \n");
  
  pinMode(rgbRed, OUTPUT);
  pinMode(rgbGreen, OUTPUT);
  pinMode(rgbBlue, OUTPUT);

  delay( 3000 ); // power-up safety delay
  FastLED.addLeds<LED_TYPE, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS).setCorrection( TypicalLEDStrip );
  FastLED.setBrightness(  BRIGHTNESS );

  for(int i=0; i<NUM_LEDS; i++){
    leds[i] = CRGB(0, 0, 0);
    FastLED.show();
  }

   colorStep = (float)255 / (float)NUM_LEDS;
  Serial.print(colorStep);

  //The default time and LED update will take place.
  //This means an Effect will take as long as the number of leds times the delayTime.
  delayTime = 100;
}

void loop() 
{
  //loopAllEffects(0, 96, 160);
  //loopAllSteadyColors(0);
  candleLightEffect(0, 0);
}

void loopAllEffects(int mainHue, int secondaryHue,  int thirdHue)
{
  for(int i = 0; i < 10; i++)
  {
    rainbowWaveEffect(0);
  }
  RGBScrollEffect(0);
  alternatingEffect(0, mainHue, secondaryHue);
  alternatingEffect(0, mainHue, secondaryHue);
  alternatingEffect(0, mainHue, secondaryHue);
  pulseEffect(0, mainHue);
  pulseEffect(0, secondaryHue);
  pulseEffect(0, thirdHue);
  rainbowFadeEffect(0);
  rainbowFadeEffect(0);
  rainbowFadeEffect(0);

  for(int i = 0; i < 10; i++)
  {
    candleLightEffect(0, 0);
  }

  for(int i = 0; i < 10; i++)
  {
    randomBlinkEffect(0, mainHue);
  }

  for(int i = 0; i < 10; i++)
  {
    discoEffect(0);
  }
}

void rainbowWaveEffect(int duration)
{
  float hue = 0;

  if(duration < 1)
  {
    //Set the default duration.
    duration = 150;
  }

  for(int j = 0; j < NUM_LEDS; j++)
  {
    for(int i = 0; i < NUM_LEDS; i++)
    {
      leds[i].setHSV(hue, 255, 255);
      hue = hue + colorStep;

      if(hue > 255)
        hue = 0;
    }
    hue = hue + colorStep;
    delay(duration);
    FastLED.show();
  }
}

void RGBScrollEffect(int duration)
{
  if(duration < 1)
  {
    //Set the default duration.
    duration = 100;
  }
  else
  {
    //This effect consists of three parts.
    //Devide by three to make the three parts the requested lenght together.
    duration = duration / 3;
  }
  
  for(int i=0; i<NUM_LEDS; i++){
    leds[i] = CRGB(255, 0, 0);
    FastLED.show();

    if(i == 0)
    {
        digitalWrite(rgbRed, 255);  
    }
    
    delay(duration);
  }
  digitalWrite(rgbRed, 0); 
  
  for(int i=0; i<NUM_LEDS; i++){
      leds[i] = CRGB(0, 255, 0);
      FastLED.show();

      if(i == 0)
      {
          digitalWrite(rgbGreen, 255);  
      }
      
      delay(duration);  
  }
  digitalWrite(rgbGreen, 0); 

  for(int i=0; i<NUM_LEDS; i++){
      leds[i] = CRGB(0, 0, 255);
      FastLED.show();
      
      if(i == 0)
      {
          digitalWrite(rgbBlue, 255);  
      }
      
      delay(duration);
  }
  digitalWrite(rgbBlue, 0); 
}

void alternatingEffect(int duration, int hueColorOne, int hueColorTwo)
{ 
  if(duration < 1)
  {
    //Calculate the default duration time.
    duration = 100;
  }

  int delayed = (duration * NUM_LEDS) / 4;
  
  for(int i = 0; i < NUM_LEDS; i++)
  {
    if(i % 2 == 0)
    {
      leds[i].setHSV(hueColorOne, 255, 255);
    }
    else
    {
      leds[i].setHSV(hueColorTwo, 255, 255);
    }
  }

  FastLED.show();
  delay(delayed);

  for(int i = 0; i < NUM_LEDS; i++)
  {
    if(i % 2 == 0)
    {
      leds[i].setHSV(hueColorTwo, 255, 255);
    }
    else
    {
      leds[i].setHSV(hueColorOne, 255, 255);
    }
  }

  FastLED.show();
  delay(delayed);
}

void pulseEffect(int duration, int hue)
{ 
  if(duration < 1)
  {
    //Set the default duration.
    duration = 100;
  }
  
  for(int i = 0; i < NUM_LEDS; i++)
  {
    leds[i].setHSV(hue, 255, 255);
    FastLED.show();
    delay(duration);
    leds[i] = CRGB(0, 0, 0);
  }
}

void rainbowFadeEffect(int duration)
{
  if(duration < 1)
  {
    duration = 50;
  }
  
  for(int i = 0; i < 255; i++)
  {
    for(int j = 0; j < NUM_LEDS; j++)
    {
      leds[j].setHSV(i, 255, 255);
    }
    FastLED.show();
    delay(duration);
  }
}

void candleLightEffect(int duration, int hue)
{
  //Its recommended to use the default duration for this effect.
  //This is to prevent extreme flickering and thereby epilepic attacks.
  if(duration < 1)
  {
    duration = 120;
  }
  
  if(0 == hue)
  {
    hue = 28;
  }
  
  int brightness = 255;
  if(random8(0, 5) < 2)
  {
    brightness = 240;
  }
  
  for(int i = 0; i < NUM_LEDS; i++)
  {
    leds[i].setHSV(hue, 255, brightness);
  }

  FastLED.show();
  delay(duration);
}

void randomBlinkEffect(int duration, int hue)
{
  if(duration < 1)
  {
    duration = 250;
  }
  
  int randomLED = random16(0, NUM_LEDS);

  for(int i = 0; i < NUM_LEDS; i++)
  {
    if(i == randomLED)
    {
      leds[i].setHSV(hue, 255, 255);
    }
    else
    {
      leds[i].setHSV(hue, 255, 128);
    }
  }
  FastLED.show();
  delay(duration);
}

void discoEffect(int duration)
{
  if(duration < 1)
  {
    duration = 500;
  }
  
  int hue = 255;
  
  for(int i = 0; i < NUM_LEDS; i++)
  {
    hue = random8(0, 255);
    leds[i].setHSV(hue, 255, 255);
  }

  FastLED.show();
  delay(duration);
}

void loopAllSteadyColors(int duration)
{  
  steadyColor(duration, 0);
  steadyColor(duration, 32);
  steadyColor(duration, 64);
  steadyColor(duration, 96);
  steadyColor(duration, 160);
  steadyColor(duration, 192);
  steadyColor(duration, 224);
  steadyColorRainbow(duration);
  steadyColorRainbow(duration);
  steadyColorRainbow(duration);
  steadyColorAlternated(duration, 160, 96);
  steadyColorAlternated(duration, 160, 0);
  steadyColorAlternated(duration, 128, 0);
}

void steadyColor(int duration, int hue)
{
  if(duration < 1)
  {
    duration = 3000;
  }
  
  for(int i = 0; i < NUM_LEDS; i++)
  {
    leds[i].setHSV(hue, 255, 255);
  }
  FastLED.show();
  delay(duration);
}

void steadyColorRainbow(int duration)
{
  if(duration < 1)
  {
    duration = 3000;
  }
  
  float hue = 0;
  
  for(int i = 0; i < NUM_LEDS; i++)
  {
    leds[i].setHSV(hue, 255, 255);
    hue = hue + colorStep;

    if(hue > 255)
      hue = 0;
  }
  FastLED.show();
  delay(duration);
}

void steadyColorAlternated(int duration, int hueColorOne, int hueColorTwo)
{
  if(duration < 1)
  {
    duration = 3000;
  }
  
  for(int i = 0; i < NUM_LEDS; i++)
  {
    if((i % 2) == 0)
    {
      leds[i].setHSV(hueColorOne, 255, 255);
    }
    else
    {
      leds[i].setHSV(hueColorTwo, 255, 255);   
    }
  }
  FastLED.show(); 
  delay(duration);
}

void steadyColorWhite(int duration)
{
  if(duration < 1)
  {
    duration = 3000;
  }
  
  for(int i = 0; i < NUM_LEDS; i++)
  {
    leds[i] = CRGB(254, 254, 254);
  }
  FastLED.show();
  delay(duration);
}

void stripOff(int timeOff)
{
  for(int i = 0; i < NUM_LEDS; i++)
  {
    leds[i] = CRGB(0, 0, 0);
  }
  FastLED.show();
  delay(timeOff);
}


