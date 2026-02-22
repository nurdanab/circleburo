#!/bin/bash

# Upload interier carousel images to MinIO
# Usage: ./upload-interier-images.sh /path/to/images/folder

MINIO_ALIAS="circleminio"
BUCKET="circleburo"
DEST_PATH="show-cases/interier"

# Check if mc (MinIO client) is configured
if ! mc alias list | grep -q "$MINIO_ALIAS"; then
    echo "MinIO alias '$MINIO_ALIAS' not found. Setting up..."
    echo "Run: mc alias set $MINIO_ALIAS https://media.circleburo.kz ACCESS_KEY SECRET_KEY"
    exit 1
fi

# If folder provided, upload all images from it
if [ -n "$1" ] && [ -d "$1" ]; then
    echo "Uploading images from $1..."

    # Find all png/jpg files and upload with sequential naming
    i=1
    for img in "$1"/*.{png,jpg,jpeg,PNG,JPG,JPEG} 2>/dev/null; do
        if [ -f "$img" ]; then
            echo "Uploading $img as block-$i.png..."
            mc cp "$img" "$MINIO_ALIAS/$BUCKET/$DEST_PATH/block-$i.png"
            ((i++))
        fi
    done

    echo "Done! Uploaded $((i-1)) images."
else
    echo "Usage: ./upload-interier-images.sh /path/to/images/folder"
    echo ""
    echo "Example:"
    echo "  ./upload-interier-images.sh ~/Desktop/interier-photos"
    echo ""
    echo "The script will rename images to block-1.png, block-2.png, etc."
    echo ""
    echo "Or upload manually:"
    echo "  mc cp image1.png $MINIO_ALIAS/$BUCKET/$DEST_PATH/block-1.png"
    echo "  mc cp image2.png $MINIO_ALIAS/$BUCKET/$DEST_PATH/block-2.png"
fi
