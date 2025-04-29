# Exit if not running as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root"
  exit 1
fi

mkdir -p /var/www/languid/
cp -r ./serverAPI/ /var/www/languid/

chown -R www-data:www-data /var/www/languid/
chmod -R 755 /var/www/languid/serverAPI/

echo "Watching for changes in ./serverAPI/ and copying to /var/www/languid/";
# Install inotify-tools if not already installed
if ! command -v inotifywait &> /dev/null
then
    echo "inotify-tools could not be found, installing..."
    apt-get update
    apt-get install -y inotify-tools
fi

inotifywait -qm -e close_write --format '%w%f' ./serverAPI/**.php | while read -r file; 
do   
    echo "Detected change in $file, copying to /var/www/languid/";
    mkdir -p "/var/www/languid/serverAPI/";
    cp "$file" "/var/www/languid/$file"; 
done
