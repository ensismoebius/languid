#include <gtest/gtest.h>

class Livro
{
    std::string titulo, autor;
    int ano;

public:
    void set(const std::string &t, const std::string &a, int y)
    {
        titulo = t;
        autor = a;
        ano = y;
    }
    std::string get() const
    {
        return "Titulo: " + titulo + ", Autor: " + autor + ", Ano: " + std::to_string(ano);
    }
};

TEST(LivroTest, ExibeCorretamente)
{
    Livro l;
    l.set("Dom Casmurro", "Machado de Assis", 1899);
    EXPECT_EQ(l.get(), "Titulo: Dom Casmurro, Autor: Machado de Assis, Ano: 1899");
}
