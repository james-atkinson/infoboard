if [ -z "$DISPLAY" ]; then #If not set DISPLAY is SSH remote or tty
	export DISPLAY=:0 # Set by default display
fi
cd ~/infoboard
yarn start > /dev/null &
sleep 15
./node_modules/.bin/electron electron.js