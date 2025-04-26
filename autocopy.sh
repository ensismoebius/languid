inotifywait -qm -e close_write --format '%w%f' api.php | while read -r file; do   echo "Detected change in $file, copying to /var/www/languid/";   cp "$file" "/var/www/languid/$file"; done
