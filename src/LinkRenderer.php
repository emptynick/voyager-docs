<?php

namespace Emptynick\VoyagerDocs;

use Illuminate\Support\Str;
use League\CommonMark\ElementRendererInterface;
use League\CommonMark\Environment;
use League\CommonMark\Inline\Element\Link;
use League\CommonMark\Inline\Element\AbstractInline;
use League\CommonMark\Inline\Renderer\InlineRendererInterface;
use League\CommonMark\HtmlElement;

class LinkRenderer implements InlineRendererInterface
{
    public $path;
    public $absolute = false;

    public function __construct($path) {
        $this->path = $path;
    }

    public function render(AbstractInline $inline, ElementRendererInterface $htmlRenderer)
    {
        if (!($inline instanceof Link)) {
            throw new \InvalidArgumentException('Incompatible inline type: ' . get_class($inline));
        }

        $attrs = array();
        if (Str::startsWith($inline->getUrl(), 'http')) {
            $attrs['href'] = $inline->getUrl();
            $attrs['target'] = '_blank';
            $attrs['rel'] = 'noopener noreferrer';
        } else {
            $path = '';
            if (!$this->absolute && $this->path != '') {
                $path = $this->path . DIRECTORY_SEPARATOR;
            }
            $path = $this->getAbsoluteFilename($path . $inline->getUrl());
            $attrs['href'] = route('voyager.voyager-docs').'?path='.$path;
        }

        return new HtmlElement('a', $attrs, $htmlRenderer->renderInlines($inline->children()));
    }

    protected function getAbsoluteFilename($filename)
    {
        $path = [];
        foreach(explode('/', $filename) as $part) {
            if (empty($part) || $part === '.') continue;

            if ($part !== '..') {
                array_push($path, $part);
            } elseif (count($path) > 0) {
                array_pop($path);
            } else {
                throw new \Exception('Climbing above the root is not permitted.');
            }
        }

        return join('/', $path);
    }
}