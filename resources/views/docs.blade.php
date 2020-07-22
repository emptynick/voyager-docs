@extends('voyager::app')
@section('page-title', __('voyager::generic.media'))
@section('content')

<collapsible title="Summary" :opened="false" class="text-xl">
    {!! str_replace([
        'Table of contents',
        '<h2>',
        '</h2>'
    ], [
        '',
        '<h4 class="mt-2">',
        '</h4>'
    ], $summary) !!}
</collapsible>

<card>
    {!! $content !!}
</card>

@endsection