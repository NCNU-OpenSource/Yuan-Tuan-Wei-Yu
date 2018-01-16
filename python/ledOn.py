import RPi.GPIO as GPIO

pin = 16

GPIO.setmode(GPIO.BCM)
GPIO.setup(16, GPIO.OUT)
GPIO.output(16, GPIO.HIGH)

# GPIO.cleanup()

