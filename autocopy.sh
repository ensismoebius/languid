mkdir -p /var/www/languid/
cp -r ./serverAPI/ /var/www/languid/

inotifywait -qm -e close_write --format '%w%f' ./serverAPI/**.php | while read -r file; 
do   
    echo "Detected change in $file, copying to /var/www/languid/";
    mkdir -p "/var/www/languid/serverAPI/";
    cp "$file" "/var/www/languid/$file"; 
done
