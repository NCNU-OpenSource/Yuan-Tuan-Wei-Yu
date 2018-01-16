import RPi.GPIO as GPIO
import time
pin = 21
GPIO.setmode(GPIO.BCM)
GPIO.setup(pin, GPIO.OUT)
while 1:
    GPIO.output(pin, True)
    time.sleep(0.01)
    GPIO.output(pin, False)
    time.sleep(0.01)
