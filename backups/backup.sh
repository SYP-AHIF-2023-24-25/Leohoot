#!/bin/bash
source /home/lhadm/.env
cd $DIRECTORY
docker exec -it $CONTAINERNAME mysqldump -p$DB_PASSWORD $DATABASE > $FILENAME
openssl enc -aes-256-cbc -salt -pbkdf2 -pass pass:$PASSWORD -in $FILENAME -out $FILENAME_ENC
# DECRYPT: openssl enc -aes-256-cbc -d -pbkdf2 -pass pass:"$PASSWORD" -in "$FILENAME_ENC" -out "FILENAME"
mkdir backups
mv $FILENAME_ENC $DIRECTORY/backups/$FILENAME_ENC
docker run --rm \
  -v ${VOLUME_NAME}:/mnt/backup \
  -v $DIRECTORY/backups:/backup \
  alpine \
  sh -c "cp /backup/$FILENAME_ENC /mnt/backup/$FILENAME_ENC"
rm $FILENAME
rm -r backups
