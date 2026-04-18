package logic

import (
	"bytes"
	"fmt"
	"image/jpeg"
	_ "image/png"

	"github.com/disintegration/imaging"
	_ "golang.org/x/image/webp"
)

func ResizeImage(imgData []byte) ([]byte, error) {
	src, err := imaging.Decode(bytes.NewReader(imgData))
	if err != nil {
		return nil, fmt.Errorf("failed to decode image: %w", err)
	}

	dst := imaging.Resize(src, 768, 0, imaging.Lanczos)

	var buf bytes.Buffer

	err = jpeg.Encode(&buf, dst, &jpeg.Options{Quality: 85})
	if err != nil {
		return nil, fmt.Errorf("failed to encode resized image: %w", err)
	}

	return buf.Bytes(), nil
}
