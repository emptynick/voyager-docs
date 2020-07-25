<?php

namespace Emptynick\VoyagerDocs;

use GrahamCampbell\Markdown\Facades\Markdown;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Illuminate\View\View;
use League\CommonMark\CommonMarkConverter;
use League\CommonMark\Environment;
use League\CommonMark\Extension\HeadingPermalink\HeadingPermalinkExtension;
use League\CommonMark\Extension\HeadingPermalink\HeadingPermalinkRenderer;
use League\CommonMark\Inline\Element\Image;
use League\CommonMark\Inline\Element\Link;

use Voyager\Admin\Classes\MenuItem;
use Voyager\Admin\Contracts\Plugins\GenericPlugin;
use Voyager\Admin\Manager\Menu as MenuManager;

class VoyagerDocs implements GenericPlugin
{
    public $name = 'Voyager docs';
    public $description = 'Display the Voyager documentation directly in your admin panel';
    public $repository = 'emptynick/voyager-docs';
    public $website = 'https://github.com/emptynick/voyager-docs';
    public $version = '1.0.0';

    private $mime_extensions = [
        'jpg'    => 'image/jpeg',
        'png'    => 'image/png',
    ];

    public function getInstructionsView(): ?View
    {
        return null;
    }

    public function registerProtectedRoutes()
    {
        //
    }

    public function registerPublicRoutes()
    {
        Route::get('docs', function (Request $request) {
            $path = $request->get('path', 'introduction.md');
            $path = str_replace('/', DIRECTORY_SEPARATOR, Str::start(urldecode($path), '/'));
            $start = Str::beforeLast(urldecode($path), DIRECTORY_SEPARATOR);
            $path = base_path('vendor/voyager-admin/voyager/docs').$path;


            $linkrenderer = new LinkRenderer($start);

            $environment = Environment::createCommonMarkEnvironment();
            $environment->addExtension(new HeadingPermalinkExtension());
            $environment->addInlineRenderer(Link::class, $linkrenderer);
            $environment->addInlineRenderer(Image::class, new ImageRenderer());

            $config = [
                'heading_permalink' => [
                    'symbol' => '',
                ],
            ];

            // TODO: Uncomment when live
            /*if (realpath($path) != $path) {
                abort(404);
            }*/

            if (File::exists($path)) {
                $converter = new CommonMarkConverter($config, $environment);
                
                $content = $converter->convertToHtml(file_get_contents($path));

                $title_pos = strpos($content, '</h1>');
                $title = strip_tags(substr($content, 0, $title_pos));
                $content = substr($content, $title_pos);

                $content = $this->replaceAlerts($content);
                
                $linkrenderer->absolute = true;
                $summary = $converter->convertToHtml(file_get_contents(base_path('vendor/voyager-admin/voyager/docs/summary.md')));

                return view('voyager-docs::docs', compact(
                    'content',
                    'summary',
                    'title'
                ));
            }

            abort(404);
        })->name('voyager-docs');

        Route::get('docs-asset', function (Request $request) {
            $path = $request->get('path', '');
            $path = str_replace('/', DIRECTORY_SEPARATOR, Str::start(urldecode($path), '/'));
            $start = Str::beforeLast(urldecode($path), DIRECTORY_SEPARATOR);
            $path = base_path('vendor/voyager-admin/voyager/docs/.gitbook/assets').$path;

            if (File::exists($path)) {
                $extension = Str::afterLast($path, '.');
                $mime = $this->mime_extensions[$extension] ?? File::mimeType($path);

                $response = response(File::get($path), 200, ['Content-Type' => $mime]);
                $response->setSharedMaxAge(31536000);
                $response->setMaxAge(31536000);
                $response->setExpires(new \DateTime('+1 year'));

                return $response;
            }

            abort(404);
        })->name('voyager-docs-asset');
    }

    public function replaceAlerts($content) {
        $content = str_replace([
            htmlspecialchars('{% hint style="info" %}'),
            htmlspecialchars('{% hint style="warning" %}'),
            htmlspecialchars('{% hint style="danger" %}'),
            htmlspecialchars('{% hint style="success" %}'),
        ], [
            '<alert color="blue" class="my-2">',
            '<alert color="yellow" class="my-2">',
            '<alert color="red" class="my-2">',
            '<alert color="green" class="my-2">'
        ], $content);
        $content = str_replace(htmlspecialchars('{% endhint %}'), '</alert>', $content);

        return $content;
    }

    public function registerMenuItems(MenuManager $menumanager)
    {
        $menumanager->addItems(
            (new MenuItem())->divider(),
            (new MenuItem('Documentation', 'document'))->route('voyager-docs')
        );
    }

    public function getCssRoutes(): array
    {
        return [];
    }

    public function getJsRoutes(): array
    {
        return [];
    }

    public function getSettingsView(): ?View
    {
        return null;
    }
}
