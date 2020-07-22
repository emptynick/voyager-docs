@extends('voyager::app')
@section('page-title', __('voyager::generic.media'))
@section('content')

<card title="{{ $title }}">
    <div slot="actions">
        <dropdown>
            <div class="p-2">
                {!! str_replace([
                    'Table of contents',
                    '<h2>',
                    '</h2>'
                ], [
                    '',
                    '<h4 class="mt-2">',
                    '</h4>'
                ], $summary) !!}
            </div>
            <div slot="opener">
                <button class="button accent">Summary</button>
            </div>
        </dropdown>
    </div>
    <div class="mt-4">
        {!! $content !!}
    </div>
</card>

@endsection