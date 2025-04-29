#include <gtest/gtest.h>
#include <string>

class Agenda
{
    std::string nomes[10];
    int qtd = 0;

public:
    void adicionar(const std::string &nome)
    {
        if (qtd < 10)
            nomes[qtd++] = nome;
    }
    std::string listar() const
    {
        std::string r;
        for (int i = 0; i < qtd; ++i)
        {
            if (i > 0)
                r += ", ";
            r += nomes[i];
        }
        return r;
    }
};

TEST(AgendaTest, AdicionaELista)
{
    Agenda a;
    a.adicionar("Ana");
    a.adicionar("João");
    EXPECT_EQ(a.listar(), "Ana, João");
}
