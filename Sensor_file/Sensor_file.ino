#include <WiFi.h>
#include <HTTPClient.h>
#include "DHT.h"

// --- Pin Config ---
#define DHTPIN 15        // DHT11 connected to GPIO15 (D15)
#define DHTTYPE DHT11
#define LED_PIN 14       // LED connected to GPIO14 (D14)

// --- WiFi Credentials ---
const char* ssid = "Vaghani_EXT";
const char* password = "20052008";

// --- ThingSpeak Configuration ---
const char* server = "http://api.thingspeak.com/update";
String apiKey = "UWNO273RNLCBR4UD"; // Replace with your Write API Key

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  dht.begin();

  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\n✅ WiFi Connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  Serial.println("Starting DHT11 sensor...");
}

void loop() {
  // Blink LED to indicate loop cycle
  digitalWrite(LED_PIN, HIGH);
  delay(200);
  digitalWrite(LED_PIN, LOW);

  // Read DHT11 Sensor
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature(); // Celsius

  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("⚠️ Failed to read from DHT sensor!");
    delay(2000);
    return;
  }

  // Print values to Serial Monitor
  Serial.print("🌡 Temperature: ");
  Serial.print(temperature);
  Serial.print(" °C | 💧 Humidity: ");
  Serial.print(humidity);
  Serial.println(" %");

  // --- Upload to ThingSpeak ---
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = String(server) + "?api_key=" + apiKey +
                 "&field1=" + String(temperature) +
                 "&field2=" + String(humidity);
    
    http.begin(url);
    int httpCode = http.GET();  // Send the request

    if (httpCode > 0) {
      Serial.println("✅ Data sent to ThingSpeak successfully!");
      Serial.print("Response Code: ");
      Serial.println(httpCode);
    } else {
      Serial.print("❌ Error sending data: ");
      Serial.println(http.errorToString(httpCode));
    }

    http.end(); // End HTTP connection
  } else {
    Serial.println("❌ WiFi not connected!");
  }

  Serial.println("-------------------------------");
  delay(1000); // ThingSpeak requires 1s delay between updates
}
