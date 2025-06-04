<?php

namespace Languid\Lib\TwigPlugin;

// Comandos para facilitar as referências
// as classes do Twig
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

/**
 * Plugin para o Twig que Carrega de forma
 * conveniente imagens, scripts e css
 */
class AssetExtension extends AbstractExtension
{
    private string $basePath;

    /**
     * Cria o carregador de recursos
     *
     * @param string $basePath Caminho do diretório de recursos
     */
    public function __construct(string $basePath)
    {
        $this->basePath = $basePath;
    }

    /**
     * Cria os comandos para o Twig
     * 
     * @return array
     */
    public function getFunctions(): array
    {
        return [
            new TwigFunction('res', [$this, 'getResPath']),
        ];
    }


    /**
     * Retorna o caminho da imagem
     *
     * @param string $resource
     * @return string
     */
    public function getResPath(string $resource): string
    {
        return sprintf('%s/%s', $this->basePath, $resource);
    }
}
