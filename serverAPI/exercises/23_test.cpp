#include <gtest/gtest.h>

class Aluno
{
public:
    std::string nome;
    float nota;
    bool aprovado() const { return nota >= 6.0; }
};

TEST(AlunoTest, Aprovacao)
{
    Aluno a;
    a.nome = "João";
    a.nota = 7.0;
    EXPECT_TRUE(a.aprovado());
    a.nota = 5.9;
    EXPECT_FALSE(a.aprovado());
}
