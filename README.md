# mandelbrot-set
The Mandelbrot set rendered using p5.js and shaders

![screenshot](./images/screenshot.png)

<h2>Controls:</h2>

click and drag mouse: move image around<br />
W: move up<br />
A: move left<br />
S: move down<br />
D: move right<br />
space: zoom in<br />
shift: zoom out

## Run Server with Docker or Podman
### Docker
```bash
docker build -t mandelbrot_image .
docker run -p 8080:80 --replace --name mandelbrot_container mandelbrot_image
```

### Podman
```bash
podman build -t mandelbrot_image .
podman run -p 8080:80 --replace --name mandelbrot_container mandelbrot_image
```
