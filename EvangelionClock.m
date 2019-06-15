#import "EvangelionClock.h"
#import <WebKit/WebKit.h>

@implementation EvangelionClock

static NSString * const evangelionClockModule = @"de.pascal-wagler.evangelion-clock";

- (id)initWithFrame:(NSRect)frame isPreview:(BOOL)isPreview {
    if (!(self = [super initWithFrame:frame isPreview:isPreview])) return nil;

    // Preference Defaults
    ScreenSaverDefaults *defaults;
    defaults = [ScreenSaverDefaults defaultsForModuleWithName:evangelionClockModule];

    [defaults registerDefaults:[NSDictionary dictionaryWithObjectsAndKeys:
        @"0", @"screenDisplayOption", // Default to show only on primary display
        nil]];
    [defaults registerDefaults:[NSDictionary dictionaryWithObjectsAndKeys:
        @"0", @"styleOption", // Default to use normal style
        nil]];

    NSString *style = @"/Webview/style-normal-3d.html";
    switch ([defaults integerForKey:@"styleOption"]) {
        case 0:
            style = @"/Webview/style-normal-3d.html";
            break;
        case 1:
            style = @"/Webview/style-red-3d.html";
            break;
        case 2:
            style = @"/Webview/style-normal.html";
            break;
        case 3:
            style = @"/Webview/style-red.html";
            break;
        default:
            style = @"/Webview/style-normal-3d.html";
            break;
    }

    // Webview
    NSURL* indexHTMLDocumentURL = [NSURL URLWithString:[[[NSURL fileURLWithPath:[[NSBundle bundleForClass:self.class].resourcePath stringByAppendingString:style] isDirectory:NO] description] stringByAppendingFormat:@"?screensaver=1%@", self.isPreview ? @"&is_preview=1" : @""]];

    WebView* webView = [[WebView alloc] initWithFrame:NSMakeRect(0, 0, frame.size.width, frame.size.height)];
    webView.drawsBackground = NO; // Avoids a "white flash" just before the index.html file has loaded
    [webView.mainFrame loadRequest:[NSURLRequest requestWithURL:indexHTMLDocumentURL cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:30.0]];

    // Show on screens based on preferences
    NSArray* screens = [NSScreen screens];
    NSScreen* primaryScreen = [screens objectAtIndex:0];

    switch ([defaults integerForKey:@"screenDisplayOption"]) {
        // Primary screen (System Preferences > Displays).
        // The screen the menubar is shown on under 'arrangement'
        case 0:
            if ((primaryScreen.frame.origin.x == frame.origin.x) || isPreview) {
                [self addSubview:webView];
            }
            break;
        // Last Focussed Screen
        // This _sometimes_ results in nothing being shown when previewing in system prefs.
        case 1:
            if (([NSScreen mainScreen].frame.origin.x == frame.origin.x) || isPreview) {
                [self addSubview:webView];
            }
            break;
        // All Screens
        case 2:
            [self addSubview:webView];
            break;
        default:
            [self addSubview:webView];
            break;
    }

    return self;
}

#pragma mark - ScreenSaverView

- (void)animateOneFrame { [self stopAnimation]; }

#pragma mark - Config
// http://cocoadevcentral.com/articles/000088.php

- (BOOL)hasConfigureSheet { return YES; }

- (NSWindow *)configureSheet
{
    ScreenSaverDefaults *defaults;
    defaults = [ScreenSaverDefaults defaultsForModuleWithName:evangelionClockModule];

    if (!configSheet)
    {
        if (![NSBundle loadNibNamed:@"ConfigureSheet" owner:self])
        {
            NSLog( @"Failed to load configure sheet." );
        }
    }

    [styleOption selectItemAtIndex:[defaults integerForKey:@"styleOption"]];
    [screenDisplayOption selectItemAtIndex:[defaults integerForKey:@"screenDisplayOption"]];
    return configSheet;
}

- (IBAction)cancelClick:(id)sender
{
    [[NSApplication sharedApplication] endSheet:configSheet];
}

- (IBAction) okClick: (id)sender
{
    ScreenSaverDefaults *defaults;
    defaults = [ScreenSaverDefaults defaultsForModuleWithName:evangelionClockModule];

    // Update our defaults
    [defaults setInteger:[styleOption indexOfSelectedItem] forKey:@"styleOption"];
    [defaults setInteger:[screenDisplayOption indexOfSelectedItem]
               forKey:@"screenDisplayOption"];

    // Save the settings to disk
    [defaults synchronize];

    // Close the sheet
    [[NSApplication sharedApplication] endSheet:configSheet];
}

#pragma mark - WebFrameLoadDelegate

- (void)webView:(WebView *)sender didFailLoadWithError:(NSError *)error forFrame:(WebFrame *)frame {
    NSLog(@"%@ error=%@", NSStringFromSelector(_cmd), error);
}

#pragma mark Focus Overrides

- (NSView *)hitTest:(NSPoint)aPoint {return self;}
//- (void)keyDown:(NSEvent *)theEvent {return;}
//- (void)keyUp:(NSEvent *)theEvent {return;}
- (void)mouseDown:(NSEvent *)theEvent {return;}
- (void)mouseUp:(NSEvent *)theEvent {return;}
- (void)mouseDragged:(NSEvent *)theEvent {return;}
- (void)mouseEntered:(NSEvent *)theEvent {return;}
- (void)mouseExited:(NSEvent *)theEvent {return;}
- (BOOL)acceptsFirstResponder {return YES;}
- (BOOL)resignFirstResponder {return NO;}

@end
