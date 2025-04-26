inotifywait -qm -e close_write --format '%w%f' *.php | while read -r file; 
do   
    echo "Detected change in $file, copying to /var/www/languid/";
    mkdir -p "/var/www/languid/serverAPI/";
    cp "$file" "/var/www/languid/serverAPI/$file"; 
done
