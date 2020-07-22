<?php

namespace Emptynick\VoyagerDocs;

use Illuminate\Support\Str;
use League\CommonMark\ElementRendererInterface;
use League\CommonMark\Environment;
use League\CommonMark\Inline\Element\Image;
use League\CommonMark\Inline\Element\AbstractInline;
use League\CommonMark\Inline\Renderer\InlineRendererInterface;
use League\CommonMark\HtmlElement;

class ImageRenderer implements InlineRendererInterface
{
    public function render(AbstractInline $inline, ElementRendererInterface $htmlRenderer)
    {
        return new HtmlElement('div', [
            'class' => 'my-2 w-full flex justify-center',
        ], '<img src="'.route('voyager-docs-asset').'?path='.Str::after($inline->getUrl(), '/assets/').'" />');
    }
}