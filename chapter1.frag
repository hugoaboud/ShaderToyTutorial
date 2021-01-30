/* This is a simple shader sandbox, created for learning purposes
   As the "chapter" 1, this offers some insights on how to think about coordinates

 author: @hugoaboud */

// It's important to remember two things:
//
// - There are two main types of shaders: fragment and vertex. Vertex shaders compute things
// related to a 3D object's shape (it's vertices, mostly), while fragment shaders compute the
// resulting color of each fragment of the object on the screen. ShaderToy is all about fragment shaders.
// Actually, a special type of fragment shaders: pixel shaders, since the "3D object" is
// a quad (a rectangle) filling the whole screen, and each "fragment" is exactly 1 pixel.
//
// - The code inside "mainImage" is run for every single pixel of the screen, and returns it's color.
// "fragCoord" is the pixel coordinate (xy), fragColor is the resulting pixel color (rgba). It's declared as "out", so
// you should assign a value to it at some time.

// HOW TO READ THIS TUTORIAL
//
// Copy each example separately into ShaderToy and follow it's steps, uncommenting some lines when noted.
// Also, go ahead and try modifying each example.

/**
    Example 1 : Minimal Shader
    Solid color on the whole screen
**/

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // vec4 -> 4D Vector (or a RGBA color)

    fragColor = vec4(1,1,1,1); // White
    //fragColor = vec4(0,0,0,1); // Black
    //fragColor = vec4(0,0,0,0); // Transparent
    //fragColor = vec4(1,1,1,0); // Also Transparent
    //fragColor = vec4(1,0,0,1); // Red
    //fragColor = vec4(0,1,0,1); // Green
    //fragColor = vec4(0,0,1,1); // Blue
}

/**
    Example 2 : X Coordinates
    Linear gradient on the X axis
**/

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Take the pixel x coordinate
    float x = fragCoord.x;

    // Set R, G, B from it
    // As R=G=B, we're expecting a black<->white gradient (grayscale) based on the X value
    fragColor = vec4(x,x,x,1);

    // <1. Run the shader>
    // Note there's a single black line, and then all white.
    // This happens because R,G,B are expecting values in the range [0,1],
    // while x is in the range of the window resolution.

    // Try scaling x by the window width, so it lies in the range [0,1]

    // <2. Uncomment lines starting with /// below>
    // iResolution is a variable available on ShaderToy, this name is
    // different on other platforms
    ///x /= iResolution.x;
    ///fragColor = vec4(x,x,x,1);

    // <3. Run the shader>
    // You should have a X gradient from black to white now
}

/**
    Example 3 : Y Coordinates
    Linear gradient on the Y axis
**/

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Take the pixel y coordinate
    float y = fragCoord.y;

    // Scale y by the height
    y /= iResolution.y;

    // Set redscale color from y [0,1]
    fragColor = vec4(y,0,0,1);
}

/**
    Example 4 : X + Y Coordinates
    Linear gradient on both X and Y axis
**/

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Scale input directly
    fragCoord.xy /= iResolution.xy;

    // Set red from x position
    // Set blue from y position
    fragColor = vec4(fragCoord.x,0,fragCoord.y,1);

    // <1. Run the shader>
    // Try to make sense of the result: on the lower left (x,y)=(0,0), the result is black
    // On the upper right (1,1), the result is Red+Blue.
}

/**
    Example 5 : Linear Interpolation (lerp/mix)
    Interpolate between two colors instead of black<->white

    Outside of ShaderToy, this is called "lerp", here it's "mix"
**/

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Scale x coordinate
    fragCoord.x /= iResolution.x;

    // Declare colors
    vec4 color1 = vec4(1,0,0,1);
    vec4 color2 = vec4(0,0,1,1);

    // Linear Interpolation (Lerp)
    fragColor = mix(color1,color2,fragCoord.x);
}

/**
    Example 6 : Fract / Modulo
    Break a gradient into multiple smaller ones: Two methods
**/

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Scale x coordinate
    float x = fragCoord.x / iResolution.x;

    // I'd like to split it in 3, so it goes [0->1|0->1|0->1]
    // (-> is lerp, | is a sudden change)
    // Try commenting the lines to watch each step
    // Make sure you comment one of the methods before running

    // # Method 1:

    // First scale the input to [0->3]
    x *= 3.0;   // (x = x * 3.0;)
    // Then, take only the fractional part of the value,
    // so 0.42 = 0.42; 1.25 = 0.25; 2.84 = 0.84
    x = fract(x);

    // # Method 2:

    // Use the modulo operator (%) to get the remainder of division
    // This operator is easier to understand thinking of integer division,
    // however shaders allow it with real numbers.
    x %= 0.333;   // (x = x % 0.333;)
    // [0->0.333|0->0.333|0->0.333]
    // Since each block goes up only to 0.333, we should scale it back to [0,1]
    x *= 3.0;

    // Grayscale
    fragColor = vec4(x,x,x,1);
}

/**
    Example 7 : Fill (if)
    Use if to create filled regions
**/

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Scale x coordinate
    float x = fragCoord.x / iResolution.x;

    // One color for each region
    // [0, 0.2[
    if (x < 0.2) fragColor = vec4(1,0,0,1);
    // [0.2, 0.7[
    else if (x < 0.7) fragColor = vec4(0,1,0,1);
    // [0.7, 1]
    else fragColor = vec4(0,0,1,1);
}

/**
    Example 8 : Rectangle
    Use if to create filled rectangle
**/

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Scale coordinates
    float x = fragCoord.x / iResolution.x;
    float y = fragCoord.y / iResolution.y;

    // If x and y are both in [0.3, 0.7]
    if (x > 0.3 && x < 0.7 && y > 0.3 && y < 0.7) {
      fragColor = vec4(1,1,1,1);
    }
}

/**
    Example 9 : Center X
    Remap X coordinates so they start on the center
    Instead of [0 -> 1], we now want [1 -> 0 -> 1].
**/

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Scale coordinates
    float x = fragCoord.x / iResolution.x;

    // Offset center so range goes from [0 -> 1] to [-0.5 -> 0.5]
    x -= 0.5;

    // Normalize to [-1 -> 1]
    x *= 2.0;

    // Now, negative values for colors don't make sense, so we take
    // the absolute value. This might not be desired on other applications.
    x = abs(x);

    // Grayscale
    fragColor = vec4(x,x,x,1);
}

/**
    Example 10 : Center X + Y
    Remap X and Y coordinates so they start on the center
    Instead of [0 -> 1], we now want [1 -> 0 -> 1] on both.
**/

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Scale coordinates
    fragCoord.xy /= iResolution.xy;

    // Offset center so ranges goes from [0 -> 1] to [-0.5 -> 0.5]
    fragCoord.xy -= 0.5;

    // Normalize to [-1 -> 1]
    fragCoord.xy *= 2.0;

    // Now, negative values for colors don't make sense, so we take
    // the absolute value. This might not be desired on other applications.
    float x = abs(fragCoord.x);
    float y = abs(fragCoord.y);

    // # Option 1: X in red, Y in blue
    //fragColor = vec4(x,0,y,1);

    // # Option 2: Grayscale in "Manhattan Distance"
    float d = x + y;
    // Please note d can reach the maximum of 2,
    // when (x,y) = (1,1), so we scale it down by 2
    d /= 2.0;
    // Grayscale
    fragColor = vec4(d,d,d,1);
}

/**
    A little fun with iTime before the next chapter
    Try to figure out what I did and mess around with it
**/

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Scale coordinates
    float x = fragCoord.x / iResolution.x;
    float y = fragCoord.y / iResolution.y;

    // Get fractional part of time (to loop)
    float t = fract(iTime); // [0..1[
    // Scale it so it loops back and forth
    t = abs((t-0.5)*2.0); // [1..0..1]

    // Animate x
    x = x+t;

    // Animate y (triple frequency!)
    y = fract((y+t)*3.0f);

    // X in red, T in green, Y in blue
    fragColor = vec4(x,t,y,1);
}
